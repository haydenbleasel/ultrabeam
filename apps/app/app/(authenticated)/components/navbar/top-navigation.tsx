'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@repo/design-system/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { useParams, useRouter } from 'next/navigation';

type TopNavigationProperties = {
  servers: {
    id: string;
    game: string;
  }[];
};

export const TopNavigation = ({ servers }: TopNavigationProperties) => {
  const params = useParams();
  const router = useRouter();

  const handleValueChange = (value: string) => {
    router.push(`/${value}`);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <svg
              width="32"
              height="32"
              viewBox="0 0 546 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Ultrabeam Logo</title>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M222.224 0H177.778V177.778H0V222.222H177.778V400H222.224V222.222H545.391V177.778H222.224V0ZM222.224 177.778H177.778V222.222H222.224V177.778Z"
                fill="black"
              />
            </svg>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <Select
            value={params.server as string | undefined}
            onValueChange={handleValueChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a server" />
            </SelectTrigger>
            <SelectContent>
              {servers.map((server) => (
                <SelectItem key={server.id} value={server.id}>
                  {server.game}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
